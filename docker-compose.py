#!/usr/bin/python3

import yaml
import sys

def update_image_version(yaml_data, service_name, new_version):
    # Wyszukuje serwisu w YAML data
    services = yaml_data.get('services', {})
    service = services.get(service_name)

    if service:
        # Zmienia wersje dla wybranego obrazu
        image = service.get('image', '')
        if ':' in image:
            image_name, old_version = image.split(':')
            service['image'] = f'{image_name}:{new_version}'
        else:
            # W przypadku braku wersji, dopisuje ją
            service['image'] = f'{image}:{new_version}'
        print(f"Updated image version for '{service_name}' to '{new_version}'")
    else:
        print(f"Service '{service_name}' not found in docker-compose.yml")


def main():
    # Pobiera ścieżkę do pliku jako argument skryptu
    file_path = sys.argv[1]

    # Kolejnymi argumentami jest nazwa serwisu oraz wersja
    service_name = sys.argv[2]
    new_version = sys.argv[3]

    # Otwiera wskazany plik docker-compose.yml
    with open(file_path, 'r') as file:
        yaml_data = yaml.safe_load(file)

    # Aktualizuje wersje obrazu
    update_image_version(yaml_data, service_name, new_version)

    # Zapisuje plik docker-compose.yml z nowmi danymi
    with open(file_path, 'w') as file:
        yaml.dump(yaml_data, file, default_flow_style=False)


if __name__ == "__main__":
    main()
