const supabase = require('../supabase')

class StaffController {
    static async getStaff(req, res) {
        try {
            const { id } = req.query
            const sql = supabase.from('staff').select('*').order('id')

            if (id) {
                sql.eq('id', id)
            }

            const { data, error } = await sql

            if (data) {
                res.status(200).json({
                    success: true,
                    data: data
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'No records found'
                })
            }

            if (error) {
                res.status(500).json({
                    success: false,
                    message: 'Query failed'
                })
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    static async insertStaff(req, res) {
        const data = req.body

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Input not available'
            })
        }

        try {
            const { data, error } = await supabase.from('staff')
                .insert({
                    staff_name: data.name,
                    staff_role: data.role,
                    staff_email: data.email,
                    staff_phone: data.phone
                })

            if (data) {
                res.status(201).json({
                    success: true,
                    message: 'Data inserted'
                })
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    static async updateStaff(req, res) {
        try {
            const id = req.params.id
            const { name, role, email, phone } = req.body
            const updates = {}

            if (name) updates.name = name
            if (role) updates.role = role
            if (email) updates.email = email
            if (phone) updates.phone = phone

            const { data, error } = await supabase.from('staff').update(updates).eq('id', id).select()

            if (error) {
                res.status(500).json({
                    success: false,
                    message: 'Unable to update'
                })
            } else {
                res.status(200).json({
                    success: true,
                    data: data
                })
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    static async deleteStaff(req, res) {
        try {
            const { id } = req.body

            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: 'Body request is empty'
                })
            }

            const { error } = await supabase.from('staff').delete().eq('id', id)

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
}

module.exports = StaffController