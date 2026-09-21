const express = require('express');
const {pool} = require("../config/db")

const router = express.Router();

router.post("/", async (req,res) => {
    const {title, deadline} = req.body;

    try{
        let ins = await pool.query("INSERT INTO assignments(title, deadline) VALUES ($1, $2) RETURNING *",[title, deadline])
        console.log(ins.rows)
    
        res.status(201).json((ins.rows)[0])

    } catch (err) {

    }
})

router.get("/", async (req,res) => {
    let {submitted} = req.query;
    try{
        if (submitted === undefined){
            let data = await pool.query("SELECT * FROM assignments ORDER BY id DESC")
            res.json(data.rows)
            return
        }

        let data = await pool.query("SELECT * FROM assignments WHERE submitted = $1 ORDER BY id DESC",[submitted])
        res.json(data.rows)
        return

    } catch (err) {

    }
})

router.get("/:id", async (req,res) => {
    const itemId = req.params.id

    try{
        let data =  await pool.query("SELECT * FROM assignments WHERE id = $1",[itemId])
        res.json(data.rows)
    } catch (err) {

    }
})

router.patch("/:id", async (req,res) => {
    const itemId = req.params.id
    try{
        await pool.query("UPDATE assignments SET submitted = true WHERE id = $1",[itemId])
        let data = await pool.query("select * from assignments where id = $1",[itemId])
        res.json(data.rows)
    } catch (err) {

    }
})

router.delete("/:id", async (req,res) => {
    const itemId = req.params.id

    try{
        let data = await pool.query("select * from assignments where id = $1",[itemId])
        if (!data.rows[0]){
            return res.status(404).json({"error" : `Assignment with id: ${itemId} Not Found`})
        }
        let deleted = await pool.query("DELETE FROM assignments where id = $1 RETURNING *",[itemId])
        console.log(deleted.rows[0])
        res.status(204).json({
            "message": "Assignment deleted successfully",
            "assingment" : deleted.rows[0]
        })
        return
    } catch (err) {

    }
})

module.exports = router;