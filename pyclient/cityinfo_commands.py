import subprocess
from aiohttp import web

app = web.Application()

async def execute_command(request):
    command = await request.post()
    output = subprocess.check_output(command['command'], shell=True)
    return web.Response(text=output.decode())

app.router.add_routes([web.post('/execute', execute_command)])

if __name__ == '__main__':
    web.run_app(app)