# ezQTL

### Getting Started

#### Install Dependencies
```bash
cd client
npm install
cd ../server
npm install
```

#### Create Configuration File
```bash
cd server
cp config.example.json config.json
# Update config.json with properties specific to your environment
```

#### Start Server
```bash
cd server
npm start
# Server runs on port 3000 by default
```

#### Start Client
```bash
cd client
npm start
# Client runs on port 3000 by default, can specify 3001 or any other port
```