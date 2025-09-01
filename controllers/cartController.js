const supabase = require('../supabase')

class CartController {
    static async getCart(req, res){
        try {
            const { data, error } = await supabase
                .from('cart')
                .select('*')
                .order('id')

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: err.message
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
                message: '200'
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}

module.exports = CartController