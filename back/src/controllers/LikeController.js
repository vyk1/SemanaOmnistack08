// É DE BOA PRÁTICA
// INDEX, ,SHOW STORE, UPDATE, DELETE
// TER APENAS ESSES 5 OP

const Dev = require('../models/Dev')

module.exports = {
    async store(req, res) {

        console.log(req.io, req.connectedUsers);

        // console.log(req.params.devId);
        //utilizando header 
        // console.log(req.headers.user);

        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        try {
            const targetDev = await Dev.findById(devId);
            if (targetDev.likes.includes(loggedDev._id)) {
                console.log('deu match');
                // PEGA SOCKET ASSOCIADO
                const loggedSocket = req.connectedUsers[user];
                const targetSocket = req.connectedUsers[devId];
                // SE ESTIVEREM LOGADOS, É ENVIADA UMA NEGOÇA 
                if (loggedSocket) {
                    req.io.to(loggedSocket).emit('match', targetDev);
                }
                if (targetSocket) {
                    req.io.to(targetSocket).emit('match', loggedDev);
                }
            } else {
                loggedDev.likes.push(targetDev._id);
            }

            await loggedDev.save();
            return res.json({ targetDev })

        } catch (error) {
            if (error.name == 'CastError') {
                return res.status(400).json('Dev Does Not Exist')

            }

        }

    }
}