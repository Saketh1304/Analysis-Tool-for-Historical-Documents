

from neo4j import GraphDatabase
import pyvis.network as net

def execute_query(uri, username, password, cypher_query):
    with GraphDatabase.driver(uri, auth=(username, password)) as driver:
        with driver.session() as session:
            result = session.run(cypher_query)
            return list(result)  # Fetch all records and convert to list

def visualize_graph(result):
    graph = net.Network()

    # Add nodes and edges to the graph
    for record in result:
        start_node = record["n"]
        end_node = record["m"]
        relationship = record["r"]
        
        # Add start node with label
        start_node_label = f"{start_node['title']} "
        graph.add_node(start_node.element_id, label=start_node_label)
        
        # Add end node with label
        end_node_label = f"{end_node['title']} "
        graph.add_node(end_node.element_id, label=end_node_label)
        
        # Add edge with label
        edge_label = f"{relationship['type']} "
        graph.add_edge(start_node.element_id, end_node.element_id, label=edge_label)
    
    # Generate HTML for the graph
    html = graph.generate_html()
    
    # Check if HTML generation was successful
    if html is not None:
        with open("graph.html", "w") as file:
            file.write(html)
        print("Graph visualization saved as 'graph.html'")
    else:
        print("Failed to generate HTML for the graph")

uri = "neo4j+s://b9f9e472.databases.neo4j.io"
username = "neo4j"
password = "kAynYI6ax95rVFpw4SaN07_-6L-maMqhuMN-baEfEM4"

cypher_query = "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100"

result = execute_query(uri, username, password, cypher_query)
visualize_graph(result)

