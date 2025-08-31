const supabase = require('../supabase')

class TestController {
    static async getTest(req, res) {
        try {
            const { data, error } = await supabase
                .from('test')
                .select('*')

            if (error) {
                throw error
            }

            res.json({
                success: true,
                data: data,
                length: data.length
            })
        } catch (error) {
            res.status(500).json({
                sucess: false,
                error: error.message
            })
        }
    }
}

module.exports = TestController