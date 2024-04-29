from flask import Flask, send_file
from neo4j import GraphDatabase
import pyvis.network as net
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Connect to Neo4j and execute a Cypher query
def execute_query(uri, username, password, cypher_query):
    with GraphDatabase.driver(uri, auth=(username, password)) as driver:
        with driver.session() as session:
            result = session.run(cypher_query)
            return list(result)

# Visualize the graph with optional node coloring and spacing adjustments
def visualize_graph(result, node_color=None, spacing=50):
    graph = net.Network()

    for record in result:
        start_node = record["n"]
        end_node = record["m"]
        relationship = record["r"]
        
        start_node_label = f"{start_node['title']} "
        graph.add_node(start_node.element_id, label=start_node_label, color=node_color[start_node.element_id] if node_color else None)
        
        end_node_label = f"{end_node['title']} "
        graph.add_node(end_node.element_id, label=end_node_label, color=node_color[end_node.element_id] if node_color else None)
        
        edge_label = f"{relationship['type']} "
        graph.add_edge(start_node.element_id, end_node.element_id, label=edge_label)
    
    graph.options = {'nodes': {'physics': True, 'distance': spacing}}
    
    return graph.generate_html()

# Determine node colors based on importance
def determine_node_color(result, important_nodes):
    node_color = {}
    for record in result:
        start_node = record["n"]
        end_node = record["m"]

        if start_node.element_id in important_nodes:
            node_color[start_node.element_id] = "#A23977"  # Parent node color
        else:
            node_color[start_node.element_id] = "#83E57E"  # Child node color
        
        if end_node.element_id in important_nodes:
            node_color[end_node.element_id] = "#A23977"  # Parent node color
        else:
            node_color[end_node.element_id] = "#83E57E"  # Child node color

    return node_color

# Identify the most important nodes based on connectivity
def determine_most_important_nodes(result, threshold):
    node_connections = {}
    for record in result:
        start_node = record["n"]
        end_node = record["m"]

        node_connections[start_node.element_id] = node_connections.get(start_node.element_id, 0) + 1
        node_connections[end_node.element_id] = node_connections.get(end_node.element_id, 0) + 1

    important_nodes = sorted(node_connections, key=node_connections.get, reverse=True)[:threshold]
    return important_nodes

# Route to serve graph visualizations
@app.route('/visualize/<int:graph_id>', methods=['GET'])
def serve_visualization(graph_id):
    uri = "neo4j+s://4b788bd6.databases.neo4j.io"
    username = "neo4j"
    password = "ow4aU7yK3r55y1xz-KrDJGSAvWjGLs6a2WIAGV0WQYE"
    
    if graph_id == 1:
        cypher_query = "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100"
        result = execute_query(uri, username, password, cypher_query)
        important_nodes = determine_most_important_nodes(result, 20)
        node_color = determine_node_color(result, important_nodes)
        html_content = visualize_graph(result, node_color, 100)
    elif graph_id == 2:
        cypher_query = "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 25"
        result = execute_query(uri, username, password, cypher_query)
        important_nodes = determine_most_important_nodes(result, 25)
        node_color = determine_node_color(result, important_nodes)
        html_content = visualize_graph(result, node_color, 200)
    else:
        cypher_query = "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100"
        result = execute_query(uri, username, password, cypher_query)
        html_content = visualize_graph(result, None, 100)
        
    filename = f"graph{graph_id}.html"
    if html_content:
        with open(filename, "w") as file:
            file.write(html_content)
        return send_file(filename, as_attachment=True)
    else:
        return "Failed to generate the graph", 500

if __name__ == "__main__":
    app.run(debug=True, port=5003)
