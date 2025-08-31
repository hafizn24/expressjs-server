const supabase = require('../supabase')

class TestController {
    static async getTest(req, res) {
        try {
            const { data, error } = await supabase
                .from('test')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Database query failed'
                })
            }

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'No records found'
                })
            }

            res.json({
                success: true,
                data: data,
                length: data.length,
                message: '200'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    static async setTest(req, res) {
        const request = req.body.data

        if (!request) {
            return res.status(400).json({
                success: false,
                message: "No data"
            })
        }

        try {

            const { data, error } = await supabase
                .from('test')
                .insert([
                    { value: request },
                ])
                .select()

            res.json({
                success: true,
                message: "Data Inserted"
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }

    static async deleteTest(req, res) {
        try{
            const {data: fetchData, error: fetchError} = await supabase
                .from('test')
                .select('id')
                .order('created_at', { ascending: false })
                .limit(1)

            if(!fetchData){
                return res.status(400).json({
                    success: false,
                    message: "No row found"
                })
            }
            
            const {error: deleteError} = await supabase
                .from('test')
                .delete()
                .eq('id', fetchData[0].id)

            res.status(200).json({
                success: true,
                message: "Data deleted"
            })
            
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}

module.exports = TestController