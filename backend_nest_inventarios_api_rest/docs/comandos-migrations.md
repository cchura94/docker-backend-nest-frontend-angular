## Comandos para generar migrationes

### ejecutar migraciones
```
npm run migration:run
```
### Generar migrationes a partir de una entity
```
npm run migration:generate --name=NombreMigration
```
### Para generar migration en blanco
```
npm run migration:create --name=NombreMigration
```
### Para revertir (rollback)
```
npm run migration:revert
```