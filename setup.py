from setuptools import setup, find_packages


setup(
    name='app',
    version='0.0.1',
    description='',
    author='Various',
    url='https://github.com/azanbertre/flask-vue-template',
    install_requires=[
        'flask',
        'pymongo',
        'bcrypt',
        'werkzeug',
        'pytest'
    ],
    packages=find_packages()
)
