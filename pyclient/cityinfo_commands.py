import subprocess
from aiohttp import web

app = web.Application()

async def execute_command(request):
    command = await request.json()
    output = subprocess.check_output(command['text'], shell=True)
    return web.Response(text=output.decode(), headers={
        'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
        'Access-Control-Allow-Methods': 'POST',  # Allow only POST requests
        'Access-Control-Allow-Headers': 'Content-Type',  # Allow the Content-Type header
    })

app.router.add_routes([web.post('/execute', execute_command)])

if __name__ == '__main__':
    web.run_app(app)
