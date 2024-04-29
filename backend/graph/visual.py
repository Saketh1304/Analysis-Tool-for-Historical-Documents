# from flask import Flask, send_file, jsonify
# from flask_cors import CORS  # To handle CORS if your frontend and backend are served on different origins
# from neo4j import GraphDatabase
# import pyvis.network as net

# app = Flask(__name__)
# CORS(app)

# # Neo4j connection details
# uri = "neo4j+s://b9f9e472.databases.neo4j.io"
# username = "neo4j"
# password = "kAynYI6ax95rVFpw4SaN07_-6L-maMqhuMN-baEfEM4"
# cypher_query = "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100"

# @app.route('/visualize', methods=['GET'])
# def visualize_and_download():
#     # Connect to Neo4j and execute the query
#     result = execute_query(uri, username, password, cypher_query)
#     # Generate graph and save to HTML
#     html_path = visualize_graph(result)
#     if html_path:
#         return send_file(html_path)
#     else:
#         return jsonify({"error": "Failed to generate the graph"}), 500

# def execute_query(uri, username, password, cypher_query):
#     with GraphDatabase.driver(uri, auth=(username, password)) as driver:
#         with driver.session() as session:
#             result = session.run(cypher_query)
#             return list(result)  # Convert to list for easier handling

# def visualize_graph(result):
#     graph = net.Network()
#     for record in result:
#         start_node, relationship, end_node = record['n'], record['r'], record['m']
#         # Updated to use `element_id` instead of `id`
#         graph.add_node(start_node.element_id, label=start_node['title'])
#         graph.add_node(end_node.element_id, label=end_node['title'])
#         graph.add_edge(start_node.element_id, end_node.element_id, label=relationship.type)
#     file_path = "graph.html"
#     graph.save_graph(file_path)
#     return file_path


# if __name__ == "__main__":
#     app.run(debug=True,port=5003)
