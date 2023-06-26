import sys
import requests

base_url = 'http://localhost:3001/api/request_chunk'

# Check if the correct number of arguments is provided
if len(sys.argv) != 3:
    print("Usage: python download_chunks.py [filename] [number_of_chunks]")
    sys.exit(1)

# Get the filename and number of chunks from command-line arguments
filename = sys.argv[1]
number_of_chunks = int(sys.argv[2])

for chunk_number in range(1, number_of_chunks + 1):
    url = f'{base_url}/{chunk_number}?filename={filename}'
    response = requests.get(url)

    if response.ok:
        print(f'Chunk {chunk_number} downloaded successfully')
    else:
        print(f'Error downloading chunk {chunk_number}: {response.text}')
