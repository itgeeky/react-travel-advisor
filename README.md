

# Travel Advisor App
<img width="1396" alt="Screenshot 2023-03-19 at 13 12 07" src="https://user-images.githubusercontent.com/90287359/226203287-81a13937-f7a3-4223-9a49-959cee86cf0e.png">

Este es un proyecto de React que utiliza la API de Google Maps para mostrar lugares de interés, tales como restaurantes, atracciones y hoteles, cerca de una ubicación determinada.

## Características

-   Muestra lugares de interés cercanos a una ubicación determinada.
-   Permite filtrar los lugares por tipo (restaurantes, atracciones, hoteles).
-   Permite filtrar los lugares por número de estrellas (rating).
-   Utiliza la API de Google Maps para mostrar un mapa interactivo.
-   Permite buscar una ubicación utilizando la API de Google Places.

## Instalación

1.  Clona este repositorio en tu máquina local.
2.  Ejecuta `npm install` para instalar todas las dependencias.
3.  Crea un archivo `.env` en el directorio raíz y agrega la siguiente variable de entorno:
    
    makefileCopy code
    
    `REACT_APP_GOOGLE_MAPS_API_KEY=<tu_clave_de_API_de_Google>` 
    
4.  Ejecuta `npm start` para iniciar la aplicación.

## Uso

Al abrir la aplicación, se te pedirá permiso para acceder a tu ubicación actual. Si lo permites, la aplicación mostrará lugares de interés cercanos a tu ubicación. Si no lo permites o la ubicación no está disponible, puedes utilizar el buscador para buscar una ubicación específica.

Una vez que se muestran los lugares de interés, puedes filtrarlos por tipo y por número de estrellas utilizando los botones en la parte superior de la pantalla.

Para ver más información sobre un lugar de interés, haz clic en su marcador en el mapa. 

Demo: https://travel-advisor-geeky.netlify.app


