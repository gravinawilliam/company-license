# Company license

## Como executar

- Execute esses comandos no seu terminal

  - ```shell
    npm install
    ```

  - ```shell
    cp .env.example .env
    ```

  - ```shell
    docker compose up -d
    ```

  - Espere o banco de dados subir e execute o comando abaixo

  - ```shell
    npm run prisma:migrate
    ```

  - ```shell
    npm run build
    ```

  - ```shell
    npm run start:prod
    ```

## Rotas da aplicação

### Rotas empresa

- List de empreasas

  ```shell
    curl --request GET \
    --url http://localhost:2222/empresas \
    --header 'private-key: private-key-1'
  ```

- Criar empresa

  ```shell
  curl --request POST \
    --url http://localhost:2222/empresa/insert \
    --header 'Content-Type: application/json' \
    --header 'host: localhost' \
    --header 'private-key: private-key-1' \
    --header 'user-agent: HTTPie' \
    --data '{
    "company_info": {
      "corporate_name": "Bill DEV",
      "cnpj": "02.636.712/0001-27",
      "address": {
        "zip_code": "05171-700",
        "city": "Ubá",
        "state": "MG",
        "street": "Rua A",
        "neighborhood": "Jardins",
        "complement": ""
      }
    }
  }'
  ```

- Editar empresa

  ```shell
  curl --request PUT \
    --url http://localhost:2222/empresa/update/59cdf236-a374-4209-8cdc-2764c61cf1f1 \
    --header 'Content-Type: application/json' \
    --header 'host: localhost' \
    --header 'private-key: private-key-1' \
    --header 'user-agent: HTTPie' \
    --data '{
    "company_update": {
      "corporate_name": "Bill DEV 2",
      "address": {
        "zip_code": "05171-700",
        "city": "Ubá",
        "state": "MG",
        "street": "Rua A",
        "neighborhood": "Jardins",
        "complement": ""
      }
    }
  }'
  ```

- Obter dados da empresa

  ```shell
  curl --request GET \
    --url http://localhost:2222/empresa/59cdf236-a374-4209-8cdc-2764c61cf1f1 \
    --header 'Content-Type: application/json' \
    --header 'host: localhost' \
    --header 'private-key: private-key-1' \
    --header 'user-agent: HTTPie'
  ```

- Deletar empresa

  ```shell
  curl --request DELETE \
    --url http://localhost:2222/empresa/delete/59cdf236-a374-4209-8cdc-2764c61cf1f1 \
    --header 'Content-Type: application/json' \
    --header 'host: localhost' \
    --header 'private-key: private-key-1' \
    --header 'user-agent: HTTPie'
  ```

### Rotas licença

- Lista de linceças

  ```shell
  curl --request GET \
  --url http://localhost:2222/licencas \
  --header 'private-key: private-key-1'
  ```

- Criar licença

  ```shell
      curl --request POST \
      --url http://localhost:2222/licenca/insert \
      --header 'Content-Type: application/json' \
      --header 'host: localhost' \
      --header 'private-key: private-key-1' \
      --header 'user-agent: HTTPie' \
      --data '{
      "company": {
      "id": "8cf2fd8d-a479-42a3-b0fa-506241b51c0c"
      },
      "license_info": {
        "license_number": "A21",
        "environmental_agency": "MG",
        "emission_date": "06-22-2020",
        "expiration_date": "06-22-2023"
      }
    }'
  ```

- Editar licença

  ```shell
  curl --request PUT \
    --url http://localhost:2222/licenca/update/ed89c3f4-f505-48c1-8847-cf978007824d \
    --header 'Content-Type: application/json' \
    --header 'host: localhost' \
    --header 'private-key: private-key-1' \
    --header 'user-agent: HTTPie' \
    --data '{
    "license_update": {
      "license_number": "DEV2",
      "environmental_agency": "SP",
      "emission_date": "06=07-2021",
      "expiration_date": "09-07-2033"
    }
  }'
  ```

- Obter dados da licença

  ```shell
  curl --request GET \
    --url http://localhost:2222/licenca/ed89c3f4-f505-48c1-8847-cf978007824d \
    --header 'Content-Type: application/json' \
    --header 'host: localhost' \
    --header 'private-key: private-key-1' \
    --header 'user-agent: HTTPie'
  ```

- Deletar licença

  ```shell
  curl --request DELETE \
    --url http://localhost:2222/licenca/delete/ed89c3f4-f505-48c1-8847-cf978007824d \
    --header 'Content-Type: application/json' \
    --header 'host: localhost' \
    --header 'private-key: private-key-1' \
    --header 'user-agent: HTTPie'
  ```
