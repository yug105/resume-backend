const { pgTable, serial, text, integer, smallint } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');


exports.users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    password: text('password').notNull(),
});

exports.templates = pgTable('templates', {
    id: serial('id').primaryKey(),
    about: text('about'),
    userid: integer('user_id').notNull()
        .references(() => exports.users.id),
});

exports.header = pgTable('header', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    city: text('city').notNull(),
    country: text('country').notNull(),
    phone: integer('phone').notNull(),
    email: text('email').notNull(),
    templateid: integer('template_id')
        .references(() => exports.templates.id)
});

exports.experience = pgTable("experience", {
    id: serial('id').primaryKey(),
    jobtitle: text('jobtitle'),
    company: text('company'),
    country: text('country'),
    months: smallint('months').default(0),
    templateid: integer('template_id')
        .references(() => exports.templates.id)
});

exports.education = pgTable("education", {
    id: serial('id').primaryKey(),
    institute: text('institute'),
    location: text('location'),
    degree: text('degree'),
    field: text('field'),
    graduationyear: integer('graduationyear'),
    templateid: integer('template_id')
        .references(() => exports.templates.id)
});

exports.skill = pgTable("skill", {
    id: serial('id').primaryKey(),
    name: text('name'),
});

exports.skillrelations = pgTable("skills", {
    id: serial('id').primaryKey(),
    skillid: integer('skill_id')
        .references(() => exports.skill.id),
    templateid: integer('template_id')
        .references(() => exports.templates.id)
});

exports.skillrelation = relations(exports.skillrelations, ({ one }) => ({
    skill: one(exports.skill, {
        fields: [exports.skillrelations.skillid],
        references: [exports.skill.id],
    }),
    template: one(exports.templates, {
        fields: [exports.skillrelations.templateid],
        references: [exports.templates.id]
    })
}));

exports.skillrelationrelation = relations(exports.skill, ({ many }) => ({
    templates: many(exports.skillrelations)
}));

exports.headerrelation = relations(exports.header, ({ one }) => ({
    template: one(exports.templates, {
        fields: [exports.header.templateid],
        references: [exports.templates.id],
    })
}));

exports.experiencerelation = relations(exports.experience, ({ one }) => ({
    template: one(exports.templates, {
        fields: [exports.experience.templateid],
        references: [exports.templates.id],
    })
}));

exports.educationrelation = relations(exports.education, ({ one }) => ({
    template: one(exports.templates, {
        fields: [exports.education.templateid],
        references: [exports.templates.id],
    })
}));

exports.templaterelation = relations(exports.templates, ({ one, many }) => ({
    author: one(exports.users, {
        fields: [exports.templates.userid],
        references: [exports.users.id],
    }),
    header: one(exports.header, {
        fields: [exports.templates.id],
        references: [exports.header.templateid],
    }),
    experiences: many(exports.experience),
    educations: many(exports.education),
    skills: many(exports.skillrelations)
}));

exports.userRelations = relations(exports.users, ({ many }) => ({
    templates: many(exports.templates)
}));