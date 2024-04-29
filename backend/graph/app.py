from flask import Flask, send_file
from neo4j import GraphDatabase
import pyvis.network as net
from flask_cors import CORS 
app = Flask(__name__)
CORS(app)


def execute_query(uri, username, password, cypher_query):
    with GraphDatabase.driver(uri, auth=(username, password)) as driver:
        with driver.session() as session:
            result = session.run(cypher_query)
            return list(result)

def visualize_graph(result, filename, node_color=None, spacing=50):
    graph = net.Network()

    for record in result:
        start_node = record["n"]
        end_node = record["m"]
        relationship = record["r"]

        start_node_label = f"{start_node['title']} "
        graph.add_node(start_node.element_id, label=start_node_label)

        end_node_label = f"{end_node['title']} "
        graph.add_node(end_node.element_id, label=end_node_label)

        edge_label = f"{relationship['type']} "
        graph.add_edge(start_node.element_id, end_node.element_id, label=edge_label)

    html = graph.generate_html()
    return html

@app.route('/visualize', methods=['GET'])
def serve_visualization():
    uri = "neo4j+s://b9f9e472.databases.neo4j.io"
    username = "neo4j"
    password = "kAynYI6ax95rVFpw4SaN07_-6L-maMqhuMN-baEfEM4"
    cypher_query = "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100"

    result = execute_query(uri, username, password, cypher_query)
    html_content = visualize_graph(result)

    if html_content:
        with open("graph.html", "w") as file:
            file.write(html_content)
        return send_file("graph.html")
    else:
        return "Failed to generate the graph", 500

if __name__ == "__main__":
    app.run(debug=True, port=5003)
