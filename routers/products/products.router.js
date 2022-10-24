
const express = require("express")
const dbconfig = require("../../db/config")
const SQLClient = require("../../db/db.container");
const products = new SQLClient(dbconfig.mariaDB, "productos");


const router = express.Router();


router.get("/", async (req, res) => {    
  const data = await products.getAll()
  res.json(data)
})

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const data =  await products.getById(+(id))
  if(data==undefined){
    res.status(404).json({ success: false, error: 'No se ha encontrado el producto' });
  }
  res.send(data)
});

router.post("/", async (req, res) => {
  const { name, price, thumbnail, description } = req.body;
  if ( !name || !price || !thumbnail || !description) {
      return res.status(400).json({ success: false, error: 'Wrong body format' });
  }
  const newProduct = {
    name,
    price: +(price),
    thumbnail,
    description
  };
  const data =  await products.save(newProduct)
  return res.json({ success: true, result: data });
});



router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, thumbnail, description } = req.body;
  if ( !name || !price || !thumbnail || !description) {
    return res.status(400).json({ success: false, error: 'Wrong body format' });
  }
  const newProduct = {
    name,
    price: +(price),
    thumbnail,
    description
};
  const updatedID = await products.updateById(+(id), newProduct)
  return res.json(updatedID);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const data =  await products.deleteById(+(id))
  res.send("El producto se ha eliminado correctamente")
});

module.exports = router;


