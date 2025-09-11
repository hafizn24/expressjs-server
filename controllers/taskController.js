const supabase = require('../supabase')

class TaskController {
    static async getTask(req, res) {
        try {
            const { id } = req.query
            const sql = supabase.from('tasks').select('*').order('id')

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

    static async insertTask(req, res) {
        const request = req.body

        if (!request) {
            return res.status(400).json({
                success: false,
                message: 'Input not available'
            })
        }

        try {
            const { data: sdData, error: sdError } = await supabase.from('staff_departments').select('id').eq("id", request.sd_id)

            if (sdError) {
                res.status(500).json({
                    success: false,
                    message: 'sd id N/A',
                    error: error.message
                })
            }

            const { data, error } = await supabase.from('tasks')
                .insert({
                    tasks_title: request.title,
                    tasks_description: request.description,
                    sd_id: request.sd_id
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

    static async updateTask(req, res) {
        try {
            const id = req.params.id
            const { title, description, sd_id } = req.body
            const updates = {}

            if (title) updates.tasks_title = title
            if (description) updates.tasks_description = description
            if (sd_id) updates.sd_id = sd_id

            const { data: sdData, error: sdError } = await supabase.from('staff_departments').select('id').eq("id", request.sd_id)

            if (sdError) {
                res.status(500).json({
                    success: false,
                    message: 'sd id N/A',
                    error: error.message
                })
            }

            const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select()

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

    static async deleteTask(req, res) {
        try {
            const { id } = req.body

            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: 'Body request is empty'
                })
            }

            const { error } = await supabase.from('tasks').delete().eq('id', id)

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

module.exports = TaskController