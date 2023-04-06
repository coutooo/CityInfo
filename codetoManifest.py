import hashlib
import json
from sawtooth_sdk.processor.handler import TransactionHandler
from sawtooth_sdk.processor.exceptions import InvalidTransaction

FAMILY_NAME = 'cityinfo'
FAMILY_VERSION = '1.0'
NAMESPACE = hashlib.sha512(FAMILY_NAME.encode('utf-8')).hexdigest()[:6]


class FileTransactionHandler(TransactionHandler):
    def __init__(self):
        self._family_name = FAMILY_NAME
        self._family_version = FAMILY_VERSION
        self._namespace = NAMESPACE

    @property
    def family_name(self):
        return self._family_name

    @property
    def family_versions(self):
        return [self._family_version]

    @property
    def namespaces(self):
        return [self._namespace]

    def apply(self, transaction, context):
        header = transaction.header
        signer = header.signer_public_key

        # Parse the payload
        payload = transaction.payload.decode('utf-8')
        action, file_hash, file_name, chunk_count = payload.split(',')

        if action == 'add':
            self._add_file(context, file_hash, file_name, chunk_count)
        elif action == 'get':
            return self._get_file(context, file_hash)

    def _add_file(self, context, file_hash, file_name, chunk_count):
        # Check if file already exists
        address = self._get_address(file_hash)
        existing_data = context.get_state([address])
        if existing_data:
            raise InvalidTransaction('File already exists')

        # Store the file data
        file_data = {
            'file_hash': file_hash,
            'file_name': file_name,
            'chunk_count': chunk_count
        }
        context.set_state({address: json.dumps(file_data).encode('utf-8')})

    def _get_file(self, context, file_hash):
        # Get file data
        address = self._get_address(file_hash)
        file_data = context.get_state([address])

        if not file_data:
            raise InvalidTransaction('File not found')

        # Return the file name and chunk count
        file_data = json.loads(file_data[0].data.decode('utf-8'))
        return file_data['file_name'], file_data['chunk_count']

    def _get_address(self, file_hash):
        return self._namespace + hashlib.sha512(file_hash.encode('utf-8')).hexdigest()[:64]
