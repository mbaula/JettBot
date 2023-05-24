module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 800,
			allowNull: false,
		},
		last_received: {
            type: DataTypes.DATE,
            defaultValue: new Date(Date.now() - 86400000),
            allowNull: false, // Allow null values for the column
        },
		vp_remaining: {
			type: DataTypes.INTEGER,
            defaultValue: 320,
            allowNull: false,
		},
		last_claimed_daily: {
            type: DataTypes.DATE,
            defaultValue: new Date(Date.now() - 86400000),
            allowNull: false, // Allow null values for the column
        },
	}, {
		timestamps: false,
	});
};