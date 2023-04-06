# Copyright 2018 Intel Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ------------------------------------------------------------------------------
'''     
Command line interface for the cityinfo transaction family.

Parses command line arguments and passes it to the cityinfoClient class
to process.
''' 

import argparse
import getpass
import logging
import os
import sys
import traceback
import pkg_resources

from colorlog import ColoredFormatter

from wallet.cityinfo_client import cityinfoClient

DISTRIBUTION_NAME = 'cityinfo'

DEFAULT_URL = 'http://rest-api:8008'

def create_console_handler(verbose_level):
    clog = logging.StreamHandler()
    formatter = ColoredFormatter(
        "%(log_color)s[%(asctime)s %(levelname)-8s%(module)s]%(reset)s "
        "%(white)s%(message)s",
        datefmt="%H:%M:%S",
        reset=True,
        log_colors={
            'DEBUG': 'cyan',
            'INFO': 'green',
            'WARNING': 'yellow',
            'ERROR': 'red',
            'CRITICAL': 'red',
        })

    clog.setFormatter(formatter)
    clog.setLevel(logging.DEBUG)
    return clog

def setup_loggers(verbose_level):
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    logger.addHandler(create_console_handler(verbose_level))

def add_send_parser(subparsers, parent_parser):
    '''Define the "send" command line parsing.'''
    parser = subparsers.add_parser(
        'send',
        help='send the number of free spaces',
        parents=[parent_parser])

    parser.add_argument(
        'text',
        type=str,
        help='the amount of free spaces')

    parser.add_argument(
        'customerName',
        type=str,
        help='the name of customer who gave data')

def add_getdata_parser(subparsers, parent_parser):
    '''Define the "getdata" command line parsing.'''
    parser = subparsers.add_parser(
        'getdata',
        help='shows getdata in your account',
        parents=[parent_parser])

    parser.add_argument(
        'customerName',
        type=str,
        help='the name of customer to withdraw from')

def create_parent_parser(prog_name):
    '''Define the -V/--version command line options.'''
    parent_parser = argparse.ArgumentParser(prog=prog_name, add_help=False)

    try:
        version = pkg_resources.get_distribution(DISTRIBUTION_NAME).version
    except pkg_resources.DistributionNotFound:
        version = 'UNKNOWN'

    parent_parser.add_argument(
        '-V', '--version',
        action='version',
        version=(DISTRIBUTION_NAME + ' (Hyperledger Sawtooth) version {}')
        .format(version),
        help='display version information')

    return parent_parser


def create_parser(prog_name):
    '''Define the command line parsing for all the options and subcommands.'''
    parent_parser = create_parent_parser(prog_name)

    parser = argparse.ArgumentParser(
        description='Provides subcommands to manage your simple wallet',
        parents=[parent_parser])

    subparsers = parser.add_subparsers(title='subcommands', dest='command')

    subparsers.required = True

    add_send_parser(subparsers, parent_parser)
    add_getdata_parser(subparsers, parent_parser)

    return parser

def _get_keyfile(customerName):
    '''Get the private key for a customer.'''
    home = os.path.expanduser("~")
    key_dir = os.path.join(home, ".sawtooth", "keys")

    return '{}/{}.priv'.format(key_dir, customerName)

def _get_pubkeyfile(customerName):
    '''Get the public key for a customer.'''
    home = os.path.expanduser("~")
    key_dir = os.path.join(home, ".sawtooth", "keys")

    return '{}/{}.pub'.format(key_dir, customerName)

def do_send(args):
    '''Implements the "send" subcommand by calling the client class.'''

    keyfile = _get_keyfile(args.customerName)

    client = cityinfoClient(baseUrl=DEFAULT_URL, keyFile=keyfile)

    response = client.send(args.text)

    print("Response: {}".format(response))


def do_getdata(args):
    '''Implements the "getdata" subcommand by calling the client class.'''
    keyfile = _get_keyfile(args.customerName)

    client = cityinfoClient(baseUrl=DEFAULT_URL, keyFile=keyfile)

    data = client.getdata()

    if data is not None:
        print("\n{} data: {}\n".format(args.customerName,
                                                        data.decode()))
    else:
        raise Exception("Data not found: {}".format(args.customerName))

def main(prog_name=os.path.basename(sys.argv[0]), args=None):    #os.path.basename(sys.argv[0])
    '''Entry point function for the client CLI.'''
    if args is None:
        args = sys.argv[1:]
    parser = create_parser(prog_name)
    args = parser.parse_args(args)

    verbose_level = 0

    setup_loggers(verbose_level=verbose_level)

    # Get the commands from cli args and call corresponding handlers
    if args.command == 'send':
        do_send(args)
    elif args.command == 'getdata':
        do_getdata(args)
    else:
        raise Exception("Invalid command: {}".format(args.command))


def main_wrapper():
    try:
        main()
    except KeyboardInterrupt:
        pass
    except SystemExit as err:
        raise err
    except BaseException as err:
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

