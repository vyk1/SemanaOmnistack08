const axios = require('axios')
const Dev = require('../models/Dev')
module.exports = {

    async index(req, res) {
        
        const { user } = req.headers;
        
        try {
            const loggedDev = await Dev.findById(user);

            try {
                const users = await Dev.find({
                    //todos ands
                    $and: [
                        //not equal
                        { _id: { $ne: user } },
                        //not in
                        { _id: { $nin: loggedDev.likes } },
                        { _id: { $nin: loggedDev.dislikes } },
                    ]
                })
                console.log('ó o user');
                console.log(users);
                
                return res.json(users);

            } catch (error) {
                console.log(error);
                return res.json({users: []}, { message: `Não foi possível achar o usuário; ${loggedDev}` });

            }
        } catch (error) {
            console.log(req);
            
            console.log('erro', error);

        }
    },
    async store(req, res) {
        // console.log (req.body.username);
        //ou
        const { username } = req.body;

        //para checar se o usuário já existe
        const userExists = await Dev.findOne({ user: username });
        if (userExists) {
            return res.json(userExists);
        }

        //axios demora então é bom colocar await
        const response = await axios.get(`https://api.github.com/users/${username}`)

        const { name, bio, avatar_url } = response.data
        // console.log(response.data);

        // console.log(name, bio, avatar_url);
        // return true;

        // pode colocar avatar_url:avatar no destructuring
        //cria no BD
        const dev = await Dev.create({ name, user: username, bio, avatar: avatar_url })

        return res.json(dev);
    }
}