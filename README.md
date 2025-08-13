# BlackCarbajalWeb

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) version 19.2.5.

## Instalar dependencias de desarrollo

Una vez descargado el proyecto, instalar las dependencias ejecutando:

```bash
npm install
```

## Configuración del Backend

Esta aplicación contiene servicios para hacer peticiones http a una API con base de datos MySQL.
Debe levantar la base de datos localmente y descargar los archivos de la API o correr la API y la BBDD en su lugar de producción.
Tenga en cuenta las variables de entorno para la llamada a la API.


## Servidor de desarrollo

Para iniciar el servidor local de desarrollo, ejecutar:

```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abra su navegador y navegue a `http://localhost:4200/` o el URL indicado en la consola. La aplicación se recargará automáticamente al modificar cualquier archivo fuente.

## Building

Para hacer la compilación de producción y generar el directorio final de distribución, ejecutar:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de compilación en el directorio `dist/`. De forma predeterminada, la compilación de producción optimiza el rendimiento y la velocidad de tu aplicación.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
