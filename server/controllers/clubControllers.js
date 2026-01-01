import Club from '../models/Club.js'
import User from '../models/User.js'

export const createClub = async (req, res) => {
    try {
        if (req.user.role !== 'system_admin'){
            return res.status(403).json({ message: 'Not authorized. Only System Admins can create clubs.'})
        }

        const{ name, description, logo, admin } = req.body

        if(!admin) {
            return res.status(400).json({ message: 'Please assign an Admin ID for this club'})
        }

        const adminUser = await User.findById(admin)
        if (!adminUser) {
            return res.status(404).json({ message: 'The user you tried to assign does not exist.'})
        }

        const clubExists = await Club.findOne({ name })
        if(clubExists) {
            return res.status(400).json({ message: 'Club already exists' })
        }

        const club = await Club.create({
            name,
            description,
            logo,
            admin: admin
        })

        if (adminUser.role !== 'club_admin') {
           adminUser.role = 'club_admin';
           await adminUser.save();
        }

        res.status(201).json(club)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getClubs = async (req, res) => {
    try {
        const clubs = await Club.find({}).select('name description logo admin')
        res.status(200).json(clubs)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateClub = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id)

        if(!club) {
            return res.status(404).json({ message: 'Club not found'})
        }

        if (club.admin.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this club'})
        }

        club.name = req.body.name || club.name;
        club.description = req.body.description || club.description
        club.logo = req.body.logo || club.logo

        const updatedClub = await club.save()
        res.status(200).json(updatedClub)
    } catch (error) {
        
    }
}