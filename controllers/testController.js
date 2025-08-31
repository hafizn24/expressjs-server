const supabase = require('../supabase')

class TestController {
    static async getTest(req, res) {
        try {
            const { data, error } = await supabase
                .from('test')
                .select('*')

            if (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Database query failed'
                })
            }

            if (!data) {
                return res.status(404).json({
                    success: false,
                    error: 'No records found'
                })
            }

            res.json({
                success: true,
                data: data,
                length: data.length
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            })
        }
    }
}

module.exports = TestController