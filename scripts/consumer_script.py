import requests
import json
import os

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

        print('Response:', data)
        print('Producer Registered...')
    except Exception as error:
        print('Error:', error)

    # input to continue script
    input("Waiting for the producer upload...(PRESS ENTER)")

    text = "cityinfo showdata test"

    try:
        response = requests.post(url, json={'text': text})
        content_type = response.headers.get('Content-Type')

        if content_type and 'application/json' in content_type:
            data = response.json()
        else:
            # Handle non-JSON response here
            data = {'message': response.text}

        print('Response:', data)
    except Exception as error:
        print('Error:', error)


    while True:
        print('1. Get Manifest')
        print('2. Download Chunks')
        print('3. Exit')
        choice = input('Enter your choice (1-3): ')
        
        if choice == '1':
            file = input('Enter the filename: ')
            response = handle_manifest_request(file)
            print(response)
        elif choice == '2':
            filename = input("Filename: ")
            start_chunk = int(input("Start Chunk: "))
            end_chunk = int(input("End Chunk: "))

            print(filename, start_chunk, end_chunk)

            handle_download(filename, start_chunk, end_chunk)
        elif choice == '3':
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
    url = f"{base_url}/{chunk_number}?filename={filename}"
    response = requests.get(url)
    
    if response.status_code == 200:
        chunk_filename = f"{filename}_{chunk_number}.txt"
        download_path = os.path.join("downloads", chunk_filename)
        
        with open(download_path, "wb") as file:
            file.write(response.content)
        
        print(f"Chunk {chunk_number} downloaded successfully")
    else:
        print(f"Error downloading chunk {chunk_number}: {response.text}")

def handle_download(filename, start_chunk, end_chunk):
    base_url = 'http://localhost:3001/api/request_chunk'

    for chunk_number in range(start_chunk, end_chunk + 1):
        print(chunk_number,filename)
        download_chunk(base_url, chunk_number, filename)

if __name__ == '__main__':
    execute()
