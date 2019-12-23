# server pro ukladani GIS objektu (polygonu, linii a bodu)

## vrstva (layer)

Logicky spolu souvisejici objekty (objects).
Tvori tematickou mapu (napr. stromy, kontejnery, ...).

## REST API

### vrstvy

- POST / - vytvori novou vrstvu
- PUT /:id - upravy vrstvu s danym _ID_
- GET /:id - vrati info o vrstve s danum _ID_
- GET / - vrati info o vrstvach podle URL params

### objekty

- POST /objs/:layerID/ - vytvori novy objekt ve vrstve s danym _layerID_

### testování

Nejprve ziskejte token na http://jwtbuilder.jamiekurtz.com/.
Dole do Key vyplnte to, co mate v environment variable SERVER_SECRET.
```
TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOi......to co da jwtbuilder

DATA='{"title":"pokus1","writers":"*","owner":"11","geomtype":"LINE"}'
wget -O- --post-data $DATA \
  --header='Content-Type:application/json' \
  --header="Authorization: Bearer $TOKEN" http://localhost:3001/layers

wget -O- http://localhost:3001/layers | json_pp
```

## zajimavosti

- http://turfjs.org
