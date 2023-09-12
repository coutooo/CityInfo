# Define the chunk size
chunk_size = 1024  # 1 kilobyte

# Create a string to fill each chunk (1024 bytes)
chunk_data = "A" * chunk_size

# Specify the main file path
main_file_path = "10chunksfile.txt"

# Create the main file and save each chunk as a separate file
for i in range(1, 11):
    chunk_name = f"10chunksfile#{i}"
    chunk_content = chunk_data.encode()  # Convert to bytes

    # Save the chunk as a separate file
    chunk_file_path = f"{chunk_name}.txt"
    with open(chunk_file_path, "wb") as chunk_file:
        chunk_file.write(chunk_content)
        print(f"Chunk '{chunk_name}' has been saved to '{chunk_file_path}'.")

    # Append the chunk to the main file
    with open(main_file_path, "ab") as main_file:
        main_file.write(chunk_content)

print(f"Main file '{main_file_path}' with 10 chunks has been created.")
