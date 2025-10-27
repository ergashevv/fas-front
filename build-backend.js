#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building backend server only...\n');

try {
  // 1. Build the server using Vite
  console.log('📦 Building server with Vite...');
  execSync('npx vite build --config vite.config.server.ts', { stdio: 'inherit' });
  
  // 2. Copy package.json to dist/server for production
  console.log('📋 Copying package.json...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Create production package.json with only server dependencies
  const serverPackageJson = {
    name: packageJson.name + '-server',
    version: packageJson.version,
    type: 'module',
    main: 'production.mjs',
    scripts: {
      start: 'node production.mjs',
      seed: 'node scripts/seed.mjs'
    },
    dependencies: {
      'express': packageJson.dependencies.express,
      'cors': packageJson.dependencies.cors,
      'mongoose': packageJson.dependencies.mongoose,
      'bcryptjs': packageJson.dependencies.bcryptjs,
      'jsonwebtoken': packageJson.dependencies.jsonwebtoken,
      'swagger-jsdoc': packageJson.dependencies['swagger-jsdoc'],
      'swagger-ui-express': packageJson.dependencies['swagger-ui-express'],
      'dotenv': packageJson.dependencies.dotenv
    }
  };
  
  fs.writeFileSync(
    'dist/server/package.json', 
    JSON.stringify(serverPackageJson, null, 2)
  );
  
  // 3. Copy .env.example to dist/server
  if (fs.existsSync('.env.example')) {
    console.log('📄 Copying .env.example...');
    fs.copyFileSync('.env.example', 'dist/server/.env.example');
  }
  
  // 4. Copy seed script
  console.log('🌱 Copying seed script...');
  if (!fs.existsSync('dist/server/scripts')) {
    fs.mkdirSync('dist/server/scripts', { recursive: true });
  }
  fs.copyFileSync('server/scripts/seed.ts', 'dist/server/scripts/seed.ts');
  
  // 5. Copy public/mocks for seeding
  console.log('📁 Copying mock data...');
  if (!fs.existsSync('dist/server/public')) {
    fs.mkdirSync('dist/server/public', { recursive: true });
  }
  if (!fs.existsSync('dist/server/public/mocks')) {
    fs.mkdirSync('dist/server/public/mocks', { recursive: true });
  }
  
  const mockFiles = ['products.json', 'categories.json', 'comments.json'];
  mockFiles.forEach(file => {
    if (fs.existsSync(`public/mocks/${file}`)) {
      fs.copyFileSync(`public/mocks/${file}`, `dist/server/public/mocks/${file}`);
    }
  });
  
  console.log('\n✅ Backend build completed successfully!');
  console.log('\n📁 Output directory: dist/server/');
  console.log('\n🚀 To run the server:');
  console.log('   cd dist/server');
  console.log('   npm install');
  console.log('   npm start');
  console.log('\n🌱 To seed database:');
  console.log('   npm run seed');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
