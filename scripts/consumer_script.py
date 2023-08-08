import requests
import json
import os
import re
import hashlib

class MerkleTree:
    def __init__(self):
        self.leaves = []
        self.num_levels = 0

    def add(self, data):
        leaf = hashlib.sha256(data.encode()).hexdigest()
        self.leaves.append(leaf)

    @property
    def root(self):
        if len(self.leaves) == 0:
            return None
        if len(self.leaves) == 1:
            return self.leaves[0]

        tree = self.leaves[:]
        self.num_levels = 0  # Reset the number of levels
        while len(tree) > 1:
            tree = self._compute_next_level(tree)
            self.num_levels += 1
        return tree[0]

    def _compute_next_level(self, level):
        next_level = []
        i = 0
        while i < len(level):
            left_child = level[i]
            right_child = level[i + 1] if i + 1 < len(level) else level[i]
            parent = self._compute_parent_hash(left_child, right_child)
            next_level.append(parent)
            i += 2
        return next_level

    def _compute_parent_hash(self, left_child, right_child):
        return hashlib.sha256((left_child + right_child).encode()).hexdigest()


def execute():
    url = 'http://localhost:8080/execute'
    text = "sawtooth keygen forum"

    try:
        response = requests.post(url, json={'text': text})
        content_type = response.headers.get('Content-Type')

        if content_type and 'application/json' in content_type:
            data = response.json()
        else:
            # Handle non-JSON response here
            data = {'message': response.text}

        print(response.text)
        print('Producer Registered...')
    except Exception as error:
        print('Error:', error)

    # input to continue script
    input("Waiting for the producer upload...(PRESS ENTER)")

    while True:
        print('1. Search in Blockchain')
        print('2. Get Manifest')
        print('3. Download Chunks')
        print('4. Verify File Signature')
        print('0. Exit')
        choice = input('Enter your choice (1-4): ')
        
        if choice == "1":
            searchData()
        elif choice == '2':
            file = input('Enter the filename: ')
            response = handle_manifest_request(file)
            print(response)
        elif choice == '3':
            filename = input("Filename: ")
            start_chunk = int(input("Start Chunk: "))
            end_chunk = int(input("End Chunk: "))

            handle_download(filename, start_chunk, end_chunk)
        elif choice == '4':
            manifest_name = input("File Name: ")
            checkSignatures(manifest_name)
        elif choice == '0':
            break
        else:
            print('Invalid choice. Please try again.')


def handle_manifest_request(file):
    if not file:
        return {'error': 'Filename parameter is missing'}
    
    try:
        response = requests.get(f'http://localhost:5000/api/manifest?file={file}')
        if response.ok:
            buffer = response.content
            handle_save_manifest(file, buffer)
            return buffer
        else:
            raise Exception('Error: ' + str(response.status_code))
    except Exception as e:
        print(e)
        return {'error': 'Failed to retrieve manifest'}

def handle_save_manifest(filename, buffer):
    if not filename or not buffer:
        return {'error': 'Filename or buffer is missing'}
    
    try:
        output_dir = os.path.join(os.getcwd(), 'manifests')
        file_path = os.path.join(output_dir, f'manifest_{filename}')
        
        with open(file_path, 'wb') as file:
            file.write(bytes(buffer))
        
        return {'message': 'Manifest file saved successfully'}
    except Exception as e:
        print(e)
        return {'error': 'Failed to save manifest file'}

def download_chunk(base_url, chunk_number, filename):
    callNDNsim()


    url = f"{base_url}/{chunk_number}?filename={filename}"
    response = requests.get(url)

    # Retrieve the manifest file
    manifest_name = "manifest_" + filename
    manifest_path = os.path.join('manifests', manifest_name)

    with open(manifest_path, 'r') as file:
        content = file.read()

    manifest_data = json.loads(content)
    indexHashes = manifest_data.get('chunks_hashs', {})
    
    if response.status_code == 200:
        chunk_filename = indexHashes["chunk_"+str(chunk_number-1)]
        download_path = os.path.join("downloads", chunk_filename)
        
        with open(download_path, "wb") as file:
            file.write(response.content)
        
        print(f"Chunk {chunk_filename} downloaded successfully")
        return chunk_filename
    else:
        print(f"Error downloading chunk {chunk_number}: {response.text}")
        return None

def handle_download(filename, start_chunk, end_chunk):
    base_url = 'http://localhost:5000/api/request_chunk'

    # Calculate Merkle tree root while downloading chunks
    merkle_tree = MerkleTree()
    downloaded_chunks = {} # Dictionary to store the downloaded chunks

    # Retrieve the manifest file
    manifest_name = "manifest_" + filename
    manifest_path = os.path.join('manifests', manifest_name)

    with open(manifest_path, 'r') as file:
        content = file.read()

    manifest_data = json.loads(content)
    merkle_tree_root = manifest_data.get('merkle_tree')
    merkle_tree_number_of_chunks = manifest_data.get('numero_de_chunks')

    for chunk_number in range(start_chunk, end_chunk + 1):
        chunk_filename = download_chunk(base_url, chunk_number, filename)

        if chunk_filename is not None:
            downloaded_chunks[chunk_number] = chunk_filename

            # Calculate hash of the downloaded chunk
            chunk_path = os.path.join("downloads", chunk_filename)
            with open(chunk_path, "rb") as chunk_file:
                chunk_content = chunk_file.read()

            chunk_hash = hashlib.sha256(chunk_content).hexdigest()
            
            chunk_hash_manif = manifest_data.get('chunks_hashs', {}).get(f'chunk_{chunk_number-1}')

            if chunk_hash == chunk_hash_manif:
                print("Hash matches. The chunk "+str(chunk_number)+" is unaltered.")
            else:
                print("Hash doesn't match. The chunk "+str(chunk_number)+" has been modified or corrupted.")
            merkle_tree.add(chunk_hash)

    # Compare the Merkle tree root with the one from the manifest

    print(merkle_tree.root)
    print(merkle_tree_root)
    if merkle_tree_number_of_chunks == (end_chunk+1-start_chunk):
        if merkle_tree.root == merkle_tree_root:
            print("Merkle tree validation successful. The chunks are unaltered.")
            print("Merkle Tree with "+str(merkle_tree.num_levels)+" levels")
        else:
            print("Merkle tree validation failed. The chunks have been modified or corrupted.")

    # Sort the downloaded chunks based on the chunk number
    sorted_chunks = sorted(downloaded_chunks.items(), key=lambda x: x[0])
    
    # Create the output file by concatenating the downloaded chunks
    output_path = os.path.join("downloads", filename)
    
    with open(output_path, "wb") as output_file:
        for chunk_number, chunk_filename in sorted_chunks:
            chunk_path = os.path.join("downloads", chunk_filename)
            
            with open(chunk_path, "rb") as chunk_file:
                output_file.write(chunk_file.read())

            if merkle_tree_number_of_chunks == (end_chunk+1-start_chunk):
                os.remove(chunk_path)  # Remove the individual chunk file after concatenating
    
    print(f"\nFile \"{filename}\" created successfully\n")

def searchData():
    url = 'http://localhost:8080/execute'   
    search = input("Filter Data in the Blockchain:")

    text = "cityinfo showdata "+search

    try:
        response = requests.post(url, json={'text': text})
        content_type = response.headers.get('Content-Type')

        if content_type and 'application/json' in content_type:
            data = response.json()
        else:
            # Handle non-JSON response here
            data = {'message': response.text}

        #print('Response:', data)
        print(response.text)
    except Exception as error:
        print('Error:', error)

def checkSignatures(file_name):
    assinatura_do_ficheiro = None # default
    manifest_name = "manifest_" + file_name
    manifest_path = os.path.join('manifests', manifest_name)
    
    with open(manifest_path, 'r') as file:
        content = file.read()
    
    data = json.loads(content)
    assinatura_do_ficheiro = data.get('assinatura_do_ficheiro')

    print("Manifest Hash: "+assinatura_do_ficheiro)
    
    # Read the file and compute its hash
    file_path = os.path.join('downloads', file_name)
    with open(file_path, 'rb') as file:
        file_contents = file.read()

    hasher = hashlib.sha256()
    hasher.update(file_contents)
    fileHash = hasher.hexdigest()

    print("Download File Hash: "+fileHash)
    # Compare the generated hash with the original hash
    if assinatura_do_ficheiro == fileHash:
        print("Hash validation successful. The data is unaltered.")
    else:
        print("Hash validation failed. The data has been modified or corrupted.")


def callNDNsim():
    os.system("cd /home/couto/Desktop/ndnSIM/ns-3 && NS_LOG=ndn.Producer:ndn.Consumer:ndn.TestGrid ./waf --run=ndn-Test")

if __name__ == '__main__':
    execute()