# server pro ukladani GIS objektu se zakladnimi atributy

GIS objekty (polygony, linie a body) stejneho vyznamu tvori vrtsvy.

## vrstva (layer)

Vrstvou muzou byt napr. body v mistech s kontenery na trideni plastu.
Dalsi vrstvou jsou napr. body v mistech s kontenery na trideni bioodpadu.
Prislusnost k nejake vrstve jednotlive body tridi do skupin.
To je dulezite pro vyhledavani.
Vrstvy se daji kombinovat v jedne mape a tvorit ruzna komplexni zobrazeni.
Rozdeleni do logicky spolu souvisejicich vrstev vektorovych bodu je zasadni.
Umoznuje vyhledavat a delat dalsi operace nad prostorovymy objekty.

## REST API

### vrstvy

- POST / - vytvori novou vrstvu
- PUT /:id - upravy vrstvu s danym _ID_
- GET /:id - vrati info o vrstve s danum _ID_
- GET / - vrati info o vrstvach podle URL params

### objekty

- POST /objs/:layerID/ - vytvori novy objekt ve vrstve s danym _layerID_
- PUT /objs/:layerID/:objID - edituje objekt s danym ID v dane vrstve
- DELETE /objs/:layerID/:objID - dtto operace smazani

## DB

Pro ukladani vektoru je pouzit PostGIS jako nejsofistikovanejsi otevrena DB.
DB schema ma 2 tabulky:
- vrstvy [layers](migrations/20190803_layers.js)
- objekty [objects](migrations/20191223_objects.js)

## testování

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
