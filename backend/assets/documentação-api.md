- `GET /metricas/`
  
  - Entrada: (nenhuma)
  - Saída:
    
    ```json
    [
        {
          "id": "MZ05I",
          "ticket_diaria": 227,
          "receita_com_taxas": 454.0,
          "taxas": 148.00,
          "comissao": 61.20,
          "nota": -1,
          "data_dia": 24,
          "data_mes": 9,
          "nome_mes": "setembro"
          "data_ano": 2024
          "id_agente": "65e9a7cca79a4524a5dd7373",
          "nome_agente": "Stella Nascimento",
          "canais": "Website",
          "data_dia_criacao": 31,
          "data_mes_criacao": "agosto",
          "data_ano_criacao": 2024,
          "siglas_condominios": "01. Beach Way",
          "estado": "Pernambuco",
          "cidade": "Tamandaré",
          "regiao": "Praia Dos Carneiros",
          "rua_numero": "11",
          "imovel": "Beach Way - Praia dos Carneiros"
        },
        {
        ...
        }
    ]
    ```

- `GET /metricas/:id`
  
  - Entrada: (nenhuma)
  - Saída: (nenhuma)
    
    ```json
     {
        "id": "MZ05I",
        "ticket_diaria": 227,
        "receita_com_taxas": 454.0,
        "taxas": 148.00,
        "comissao": 61.20,
        "nota": -1,
        "data_dia": 24,
        "data_mes": 9,
        "nome_mes": "setembro"
        "data_ano": 2024
        "id_agente": "65e9a7cca79a4524a5dd7373",
        "nome_agente": "Stella Nascimento",
        "canais": "Website",
        "data_dia_criacao": 31,
        "data_mes_criacao": "agosto",
        "data_ano_criacao": 2024,
        "siglas_condominios": "01. Beach Way",
        "estado": "Pernambuco",
        "cidade": "Tamandaré",
        "regiao": "Praia Dos Carneiros",
        "rua_numero": "11",
        "imovel": "Beach Way - Praia dos Carneiros"
    }
    ```

- `POST /metricas/`
  
  - Entrada: Dados da métrica
    
    ```json
    {
        "id": "MZ05I",
        "ticket_diaria": 227,
        "receita_com_taxas": 454.0,
        "taxas": 148.00,
        "comissao": 61.20,
        "nota": -1,
        "data_dia": 24,
        "data_mes": 9,
        "nome_mes": "setembro"
        "data_ano": 2024
        "id_agente": "65e9a7cca79a4524a5dd7373",
        "nome_agente": "Stella Nascimento",
        "canais": "Website",
        "data_dia_criacao": 31,
        "data_mes_criacao": "agosto",
        "data_ano_criacao": 2024,
        "siglas_condominios": "01. Beach Way",
        "estado": "Pernambuco",
        "cidade": "Tamandaré",
        "regiao": "Praia Dos Carneiros",
        "rua_numero": "11",
        "imovel": "Beach Way - Praia dos Carneiros"
    }
    ```
  - Saída: (nenhuma)

- `PUT /metricas/:id `
  
  - Entrada:  Dados atualizados
    
    ```json
    {
        "id": "MZ05I",
        "ticket_diaria": 227,
        "receita_com_taxas": 454.0,
        "taxas": 148.00,
        "comissao": 61.20,
        "nota": -1,
        "data_dia": 24,
        "data_mes": 9,
        "nome_mes": "setembro"
        "data_ano": 2024
        "id_agente": "65e9a7cca79a4524a5dd7373",
        "nome_agente": "Stella Nascimento",
        "canais": "Website",
        "data_dia_criacao": 31,
        "data_mes_criacao": "agosto",
        "data_ano_criacao": 2024,
        "siglas_condominios": "01. Beach Way",
        "estado": "Pernambuco",
        "cidade": "Tamandaré",
        "regiao": "Praia Dos Carneiros",
        "rua_numero": "11",
        "imovel": "Beach Way - Praia dos Carneiros"
    }
    ```
  
  - Saída: (nenhuma)

- `DELETE /metricas/:id`
  
  - Entrada: (nenhuma)
  
  - Saída: (nenhuma)

- `PUT /nota/`
  
  - Entrada: Id e valor da nota
    
    ```json
    [
        {
            "id": "MZ05I",
            "nota": 5
        },
        {
            "id": "MY10I",
            "nota": 4
        }
    ]
    ```
  
  - Saída: (nenhuma)

