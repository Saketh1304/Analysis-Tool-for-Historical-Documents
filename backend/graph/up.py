# #!/usr/bin/env python
# # coding: utf-8

# # In[1]:


# pip install neo4j


# # In[2]:


# pip install pyvis neo4j


# In[14]:


from neo4j import GraphDatabase
import pyvis.network as net

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
        graph.add_node(start_node.element_id, label=start_node_label, color=node_color[start_node.element_id] if node_color else None)
        
        end_node_label = f"{end_node['title']} "
        graph.add_node(end_node.element_id, label=end_node_label, color=node_color[end_node.element_id] if node_color else None)
        
        edge_label = f"{relationship['type']} "
        graph.add_edge(start_node.element_id, end_node.element_id, label=edge_label)
    
    graph.options = {'nodes': {'physics': True, 'distance': spacing}}
    
    html = graph.generate_html()
    
    if html is not None:
        with open(filename, "w") as file:
            file.write(html)
        print(f"Graph visualization saved as '{filename}'")
    else:
        print("Failed to generate HTML for the graph")

def determine_node_color(result, important_nodes):
    node_color = {}
    for record in result:
        start_node = record["n"]
        end_node = record["m"]
        
        if start_node.element_id in important_nodes:
            node_color[start_node.element_id] = "red"
        else:
            node_color[start_node.element_id] = "blue"
        
        if end_node.element_id in important_nodes:
            node_color[end_node.element_id] = "red"
        else:
            node_color[end_node.element_id] = "blue"
        
    return node_color

def determine_most_important_nodes(result, threshold):
    node_connections = {}
    for record in result:
        start_node = record["n"]
        end_node = record["m"]
        
        node_connections[start_node.element_id] = node_connections.get(start_node.element_id, 0) + 1
        node_connections[end_node.element_id] = node_connections.get(end_node.element_id, 0) + 1
    
    important_nodes = sorted(node_connections, key=node_connections.get, reverse=True)[:threshold]
    return important_nodes

uri = "neo4j+s://b9f9e472.databases.neo4j.io"
username = "neo4j"
password = "kAynYI6ax95rVFpw4SaN07_-6L-maMqhuMN-baEfEM4"

cypher_query = "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100"

result = execute_query(uri, username, password, cypher_query)

important_nodes_20 = determine_most_important_nodes(result, 20)

node_color = determine_node_color(result, important_nodes_20)


visualize_graph(result, "graph1.html", node_color=node_color, spacing=100)  
cypher_query_2 = "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 25"
result_2 = execute_query(uri, username, password, cypher_query_2)
important_nodes_25 = determine_most_important_nodes(result_2, 25)
node_color_graph2 = determine_node_color(result_2, important_nodes_25)
visualize_graph(result_2, "graph2.html", node_color=node_color_graph2, spacing=200)  
visualize_graph(result, "graph3.html", node_color=None, spacing=100)  

