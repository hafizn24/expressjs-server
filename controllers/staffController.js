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
                    message: 'Query failed',
                    error: error.message
                })
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            })
        }
    }

    static async insertStaff(req, res) {
        const request = req.body

        if (!request) {
            return res.status(400).json({
                success: false,
                message: 'Input not available'
            })
        }

        try {
            const { data, error } = await supabase.from('staff')
                .insert({
                    staff_name: request.name,
                    staff_role: request.role,
                    staff_email: request.email,
                    staff_phone: request.phone
                })

            console.log(error)

            if (error) {
                res.status(500).json({
                    success: false,
                    message: 'Unable to insert',
                    error: error.message
                })
            } else {
                res.status(201).json({
                    success: true,
                    message: 'Data inserted'
                })
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            })
        }
    }

    static async updateStaff(req, res) {
        try {
            const id = req.params.id
            const { name, role, email, phone } = req.body
            const updates = {}

            if (name) updates.staff_name = name
            if (role) updates.staff_role = role
            if (email) updates.staff_email = email
            if (phone) updates.staff_phone = phone

            const { data, error } = await supabase.from('staff').update(updates).eq('id', id).select()

            if (error) {
                res.status(500).json({
                    success: false,
                    message: 'Unable to update',
                    error: error.message
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
                message: 'Internal server error',
                error: error.message
            })
        }
    }

    static async deleteStaff(req, res) {
        try {
            const { id } = req.body

            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: 'Body request is empty'
                })
            }

            const { error } = await supabase.from('staff').delete().eq('id', id)

            if (error) {
                res.status(500).json({
                    success: false,
                    message: 'Unable to delete',
                    error: error.message
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Succefully deleted"
                })
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            })
        }
    }
}

module.exports = StaffController