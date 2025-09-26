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
}

module.exports = RegisterController