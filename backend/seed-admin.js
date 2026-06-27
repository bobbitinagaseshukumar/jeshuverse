import { sequelize } from './config/db.js';
import { User } from './models/index.js';

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    
    const email = 'haribabug08@gmail.com';
    const password = 'jeshvith-a';
    
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      userExists.password = password;
      userExists.isAdmin = true;
      await userExists.save();
      console.log(`Admin account updated successfully: ${email}`);
    } else {
      await User.create({
        name: 'Haribabu',
        email,
        password,
        mobile: '+919999999999',
        address: 'JeshuVerse Head Office, Mumbai, India',
        isAdmin: true
      });
      console.log(`Admin account created successfully: ${email}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
