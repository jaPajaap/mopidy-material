from __future__ import absolute_import, unicode_literals

import re
from setuptools import setup, find_packages


def get_version(filename):
    content = open(filename).read()
    metadata = dict(re.findall("__([a-z]+)__ = '([^']+)'", content))
    return metadata['version']


setup(
    name='Mopidy-Material',
    version=get_version('mopidy_material/__init__.py'),
    url='https://github.com/japajaap/mopidy-material',
    license='Apache License, Version 2.0',
    author='Jaap Gerritsen',
    author_email='jaapgerritsen@gmail.com',
    description='A mopidy client optimized for spotify and mobile simplicity',
    long_description=open('README.md').read(),
    packages=find_packages(exclude=['tests', 'tests.*']),
    zip_safe=False,
    include_package_data=True,
    install_requires=[
        'setuptools',
        'Mopidy >= 0.19'
    ],
    entry_points={
        'mopidy.ext': [
            'material = mopidy_material:MaterialExtension',
        ],
    },
    classifiers=[
        'Environment :: No Input/Output (Daemon)',
        'Intended Audience :: End Users/Desktop',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 2',
        'Topic :: Multimedia :: Sound/Audio :: Players',
    ],
)