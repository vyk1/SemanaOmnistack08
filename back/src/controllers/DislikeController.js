// É DE BOA PRÁTICA
// INDEX, ,SHOW STORE, UPDATE, DELETE
// TER APENAS ESSES 5 OP

const Dev = require('../models/Dev')

module.exports = {
    async store(req, res) {
        // console.log(req.params.devId);
        //utilizando header 
        // console.log(req.headers.user);

        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        try {
            const targetDev = await Dev.findById(devId);
            loggedDev.dislikes.push(targetDev._id);

            await loggedDev.save();
            return res.json({ targetDev })

        } catch (error) {
            if (error.name == 'CastError') {
                return res.status(400).json('Dev Does Not Exist')

            }
        }
    }
}