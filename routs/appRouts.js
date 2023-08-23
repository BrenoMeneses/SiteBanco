const express = require('express')
const routs = express.Router()
const usuario = require('../models/usuarios.js')
const contabanco = require('../models/contabanco.js')
const session = require('express-session')

routs.get('/', (req, res)=>{
    res.render("home")
})

routs.get('/cadastro', (req, res)=>{
    res.render("cadastro")
})

routs.post('/cadastro', async (req, res)=>{

    if(req.body.senha === req.body.confSenha){
        let Usuarios = await usuario.findOne({where: {nome: req.body.nome}});
        if(Usuarios == null){
            let conta = await contabanco.create()
            let user = await usuario.create({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha,
                contaId: conta.idconta
            })
            session.conta = conta
            session.usuario = user  
            res.redirect("/conta/" + session.usuario.dataValues.id)
        }else{
            res.render("cadastro", {errNome: "nome ja cadastrado"})
        }
    }else{
        res.render("cadastro", {errSenha: "senhas diferentes"})
    }

})

routs.get('/conta', async (req, res)=>{

    if(session.usuario == undefined){
        console.log(req.session.usuario)
        res.render("undefined")
    }else{
        console.log(req.session.usuario)
        res.redirect("/conta/" + session.usuario.dataValues.id)
    }

})  

routs.get('/conta/:id', async (req, res)=>{

    let id = req.params.id

    let Usuario = await usuario.findOne({where: {id: id}})
    if(Usuario == null){
        res.send("usuario nao encontrado")
    }else{
        let conta = await contabanco.findOne({where: {idconta: Usuario.contaId}})
        res.render("conta", {Usuario: Usuario, conta: conta})
    }
})

routs.get('/login', (req, res)=>{
    res.render("login")
})

routs.post('/login', async (req, res)=>{

    let Usuario = await usuario.findOne({where: {nome: req.body.nome}})
    if(Usuario == null){
        res.render("login", {errNome: "nome não encontrado"})
    }else{

        if(Usuario.senha == req.body.senha){

            let conta = await contabanco.findOne({where: {idconta: Usuario.contaId}})
            session.conta = conta
            session.usuario = Usuario
            res.redirect("/conta/" + session.usuario.dataValues.id)

        }else{
            res.render("login", {errSenha: "senha incorreta"})
        }

    }
})

routs.get('/transferir/:id', (req,res)=>{
    res.render("transferir", {Usuario: session.usuario})
})

routs.post('/transferir/:id', async (req, res)=>{

    let id = req.params.id

    let Usuario = await usuario.findOne({where: {id: id}})
    let conta = await contabanco.findByPk(Usuario.contaId)

    let contaT = await contabanco.findOne({where: {idconta: req.body.numConta}})
    
    


    if(contaT == null){
        res.render("transferir", {errConta: "esse numero de conta não existe", Usuario: session.usuario})
        
    }else{
        let UsuarioT = await usuario.findOne({where: {contaId: contaT.idconta}})

        let valorT = req.body.ValorT
        let saldo = conta.dinheiro
        let saldoT = contaT.dinheiro

        if(saldo < valorT || valorT == 0){
            res.render("transferir", {errSaldo: "saldo insuficiente", Usuario: session.usuario})

        }else{
            if(Usuario.senha == req.body.senha){

                let valorMenos = Number(saldo) - Number(valorT)
                let valorMais = Number(saldoT) + Number(valorT)

                await conta.update({dinheiro: valorMenos}).then(async ()=>{

                    await contaT.update({dinheiro: valorMais}).then(()=>{

                        console.log("transação feita com sucesso")

                    }).catch(async (err)=>{

                        console.log("algo deu errado! " + err)
                        await conta.update({dinheiro: saldo})

                    })

                }).catch((err)=>{
                    console.log("algo deu errado! " + err)
                })

                res.redirect("/conta")

            }else{
                res.render("transferir", {errSenha: "senha incorreta", Usuario: session.usuario})
            }
        }
    }

})

routs.get('/depositar/:id', (req, res)=>{
    res.render("depositar", {Usuario: session.usuario})
})

routs.post('/depositar/:id', async (req, res)=>{

    let valorD = req.body.valorD
    let Usuario = await usuario.findByPk(req.params.id)
    let conta = await contabanco.findByPk(Usuario.contaId)

    if(req.body.senha == Usuario.senha){

        valorFinal = Number(conta.dinheiro) + Number(valorD)

        await conta.update({dinheiro: valorFinal})
        await conta.save()
        res.redirect("/conta")
    }else{
        res.render("depositar", {errSenha: "senha incorreta", Usuario: session.usuario})
    }

})

module.exports = routs
