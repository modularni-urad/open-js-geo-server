# server pro ukladani GIS entyt (polygonu, linii a bodu)

## vrstva (layer)

Logicky spolu souvisejici entity.
Tvori tematickou mapu (napr. stromy, kontejnery, ...).

## REST API

### vrstvy

- POST / - vytvori novou vrstvu
- PUT /:id - upravy vrstvu s danym _ID_
- GET /:id - vrati info o vrstve s danum _ID_
- GET / - vrati info o vrstvach podle URL params

### polygony

- POST /:layerID/ - vytvori novy polygon ve vrstve s danym _layerID_
