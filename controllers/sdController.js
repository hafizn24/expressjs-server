const supabase = require('../supabase')

class SDController {
    static async getSD(req, res) {
        try {
            const { id } = req.query
            const sql = supabase.from('staff_deparments').select('*').order('id')

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

    static async insertSD(req, res) {
        const request = req.body

        if (!request) {
            return res.status(400).json({
                success: false,
                message: 'Input not available'
            })
        }

        try {
            const { data: staffData, error: staffError } = await supabase.from('staff').select('id').eq("id", request.staff_id)

            if (staffError) {
                res.status(500).json({
                    success: false,
                    message: 'staff id N/A',
                    error: error.message
                })
            }

            const { data: deptData, error: deptError } = await supabase.from('departments').select('id').eq("id", request.dept_id)

            if (deptError) {
                res.status(500).json({
                    success: false,
                    message: 'department id N/A',
                    error: error.message
                })
            }

            const { data, error } = await supabase.from('staff_departments')
                .insert({
                    staff_id: staffData.id,
                    dept_id: deptData.id
                })

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

    static async updateSD(req, res) {
        try {
            const id = req.params.id
            const { staff_id, department_id } = req.body
            const updates = {}

            if (staff_id) {
                updates.staff_id = staff_id
                const { data: staffData, error: staffError } = await supabase.from('staff').select('id').eq("id", request.staff_id)

                if (staffError) {
                    res.status(500).json({
                        success: false,
                        message: 'staff id N/A',
                        error: error.message
                    })
                }
            }
            if (department_id) {
                updates.department_id = department_id
                const { data: deptData, error: deptError } = await supabase.from('departments').select('id').eq("id", request.dept_id)

                if (deptError) {
                    res.status(500).json({
                        success: false,
                        message: 'department id N/A',
                        error: error.message
                    })
                }
            }

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

    static async deleteSD(req, res) {
        try {
            const { id } = req.body

            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: 'Body request is empty'
                })
            }

            const { error } = await supabase.from('staff_departments').delete().eq('id', id)

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

module.exports = SDController