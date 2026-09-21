const express = require('express');
const router = require("./router/router")

const app = express();
const PORT = 3003;

app.use(express.json())

app.use("/assignments", router)

app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`)
})