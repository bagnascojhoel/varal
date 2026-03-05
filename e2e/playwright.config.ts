import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 5,
  use: { baseURL: 'http://localhost:3001' },
  webServer: [
    {
      command: 'npx mockoon-cli start --data mock-server/mockoon-data.json',
      cwd: './',
      port: 9999,
      reuseExistingServer: false,
      timeout: 10_000,
    },
    {
      command: 'npm run dev',
      cwd: '../',
      url: 'http://localhost:3001',
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        PORT: '3001',
        OPENMETEO_HOST: 'http://localhost:9999/open-meteo',
        BIGDATACLOUD_HOST: 'http://localhost:9999/big-data-cloud',
        NOMINATIM_HOST: 'http://localhost:9999/nominatim',
        VIACEP_HOST: 'http://localhost:9999/via-cep',
        BIGDATACLOUD_API_KEY: 'mock-key',
      },
    },
  ],
});
