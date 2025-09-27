const supabase = require('../supabase')

class RegisterController {
    static async setRegister(req, res) {
        const { user, location, invitation, contact } = req.body;

        try {
            const { data: userData, error: userError } = await supabase.from('users').insert([user]).select('*').single();
            const { data: locData } = await supabase.from('locations').insert([location]).select('*').single();

            const invitationPayload = {
                ...invitation,
                user_id: userData.user_id,
                location_id: locData.loc_id,
            };
            const { data: invData } = await supabase.from('invitations').insert([invitationPayload]).select('*').single();

            const contactPayload = {
                ...contact,
                inv_id: invData.inv_id,
            };
            await supabase.from('contacts').insert([contactPayload]);

            res.json({ success: true, user_id: userData.user_id, inv_id: invData.inv_id });
        } catch (error) {
            console.error('Insert error:', error);
            res.status(500).json({
                error: 'Insert failed',
                message: error.message,
            });
        }
    }

    static async getAllUserData(req, res) {
        const { user_name, user_email, user_phone } = req.query;

        try {
            let userQuery = supabase.from('users').select('*');

            if (user_name) {
                userQuery = userQuery.eq('user_name', user_name);
            } else if (user_email) {
                userQuery = userQuery.eq('user_email', user_email);
            } else if (user_phone) {
                userQuery = userQuery.eq('user_phone', user_phone);
            }

            const { data: users, error: userError } = await userQuery;
            if (userError) {
                return res.status(500).json({ success: false, message: 'User query failed', error: userError.message });
            }

            if (!users || users.length === 0) {
                return res.status(404).json({ success: false, message: 'No users found' });
            }

            // Fetch related data for each user
            const results = await Promise.all(users.map(async (user) => {
                const { data: invitation } = await supabase
                    .from('invitations')
                    .select('*')
                    .eq('user_id', user.user_id)
                    .single();

                const { data: location } = await supabase
                    .from('locations')
                    .select('*')
                    .eq('loc_id', invitation?.location_id)
                    .single();

                const { data: contacts } = await supabase
                    .from('contacts')
                    .select('*')
                    .eq('inv_id', invitation?.inv_id);

                return {
                    user,
                    invitation,
                    location,
                    contacts,
                };
            }));

            res.json({ success: true, count: results.length, data: results });
        } catch (error) {
            console.error('Fetch error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = RegisterController