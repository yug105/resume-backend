const express = require('express');
const router = express.Router();
const authmiddleware = require('../middlewares/auth');
const {db} = require('../db/dbclient');
const {eq} = require('drizzle-orm');
const {templates,header,experience,education,skillrelations,skill} = require('../db/schema');


router.use(authmiddleware);
router.post('/createtemplate',async(req,res)=>{
    const {about,headerdata,experiences,educations,skills}=req.body;
    const userid = req.userId;
    
    if (!userid) {
        return res.status(401).json({ error: "Unauthorized - Missing user ID" });
      }
    console.log(userid);
    const [template] = await db.insert(templates).values({
        about,userid:userid}).returning();
    console.log(template);

    if(headerdata){
        const [headers] = await db.insert(header).values({
            ...headerdata,
            templateid:template.id
        }).returning();
        console.log(headers);
    }
    if(experiences){
        const [experiencess] = await db.insert(experience).values(
            experiences.map(exp=>({
                ...exp,
                templateid:template.id
            }))
        ).returning();
    }

    if(educations){
        const [educationss]= await db.insert(education).values(
            educations.map(edu=>({
                ...edu,
                templateid:template.id
            }))
        ).returning();
    }

    if(skills){
       const skillss= await db.insert(skill).values(
            skills.map(skl=>({
               name:skl.name
            }))
        ).returning();
        console.log(skillss);
         await db.insert(skillrelations).values(
            skillss.map(skl=>(
                {
                skillid:skl.id,
                templateid:template.id
            }))
        ) 
    }
    res.status(201).json(template);
   

})
router.get('/',async(req,res)=>{
    const userid = req.userId;
    // const template = await db.select().from(templates).where(eq(templates.userid,userid));
    const userTemplates = await db.query.templates.findMany({
        where: eq(templates.userid, userid),
        with: {
          header: true,
          experiences: true,
          educations: true,
          skills: {
            with: {
              skill: true
            }
          }
        }
      });
    res.json(userTemplates);
})
router.put('/update/:id',async(req,res)=>{
    const {id}=req.params;
    const userid = req.userId;
    const {about,headerdata,experiences,educations,skills}=req.body;
    const templatess = await db.update(templates)
    .set({about}).where(eq(templates.userid,userid) && eq(templates.id,id))
    .returning();
    if(headerdata){
        const existingHeader = await db.select().from(header).where(eq(header.templateid, id));
        if (existingHeader.length) {
            await db.update(header)
                .set(headerdata)
                .where(eq(header.templateid, id));
        } else {
            await db.insert(header).values({ ...headerdata, templateid: id });
        }
    }
    if(experiences){
        const existingexp = await db.select().from(experience).where(eq(experience.templateid,id))
        const expids = new Set(existingexp.map(exp=>exp.id))
        for(const exp of experiences){
            if(exp.id){
                await db.update(experience)
                .set(exp)
                .where(eq(experience.id,exp.id) && eq(experience.templateid,id))

                expids.delete(exp.id);
            }else{
                await db.insert(experience).values({...exp,templateid:id})
            }
        }
        for (const expId of expids) {
            await db.delete(experience).where(eq(experience.id, expId));
        }
    }

    if (educations !== undefined) {
        
        const existingEducations = await db.select().from(education).where(eq(education.templateid, id));
        const existingEduIds = new Set(existingEducations.map(edu => edu.id));

        
        for (const edu of educations) {
            if (edu.id) {
               
                await db.update(education)
                    .set(edu)
                    .where(eq(education.id, edu.id) && eq(education.templateid, id));
                existingEduIds.delete(edu.id); 
            } else {
            
                const [newEducation] = await db.insert(education).values({
                    ...edu,
                    templateid: id
                }).returning();
                existingEduIds.delete(newEducation.id); 
            }
        }


        for (const eduId of existingEduIds) {
            await db.delete(education).where(eq(education.id, eduId));
        }
    }
    if (skills !== undefined) {
        // Fetch existing skills and skill relations
        const existingSkillRelations = await db.query.skillrelations.findMany({
            where: eq(skillrelations.templateid, id),
            with: {
                skill: true
            }
        });
        const existingSkillIds = new Set(existingSkillRelations.map(sr => sr.skillid));

        // Update or insert new skills
        for (const skl of skills) {
            if (skl.id) {
                const existingSkillRelation = existingSkillRelations.find(sr => sr.skillid === skl.id);
                if (existingSkillRelation) {
                    // Update the skill if necessary
                    if (existingSkillRelation.skill.name !== skl.name) {
                        await db.update(skill)
                            .set({ name: skl.name })
                            .where(eq(skill.id, skl.id));
                    }
                    existingSkillIds.delete(skl.id); // Remove from set if updated
                }
            } else {
                // Check if skill already exists
                const existingSkill = await db.select().from(skill).where(eq(skill.name, skl.name));

                let skillId;
                if (existingSkill.length) {
                    skillId = existingSkill[0].id;
                } else {
                    const [newSkill] = await db.insert(skill).values({ name: skl.name }).returning();
                    skillId = newSkill.id;
                }

                // Insert new skill relation
                await db.insert(skillrelations).values({
                    skillid: skillId,
                    templateid: id
                });
            }
        }

        // Delete skill relations that are not in the request body
        for (const skillId of existingSkillIds) {
            await db.delete(skillrelations)
                .where(eq(skillrelations.skillid, skillId) && eq(skillrelations.templateid, id));
        }
    }
    res.status(200).json({ message: "Template updated successfully" });
})

router.delete('/deletetemplate/:id', async (req, res) => {
    const { id } = req.params;
    const userid = req.userId;

    if (!userid) {
        return res.status(401).json({ error: "Unauthorized - Missing user ID" });
    }

    try {
       
        const headerDeletionResult = await db.delete(header).where(eq(header.templateid, id));

        const skillRelationsDeletionResult = await db.delete(skillrelations).where(eq(skillrelations.templateid, id));
        console.log("Skill relations deletion result:", skillRelationsDeletionResult);

        const experiencesDeletionResult = await db.delete(experience).where(eq(experience.templateid, id));
        console.log("Experiences deletion result:", experiencesDeletionResult);

        const educationsDeletionResult = await db.delete(education).where(eq(education.templateid, id));
        console.log("Educations deletion result:", educationsDeletionResult);


        const deletedTemplate = await db.delete(templates)
            .where(eq(templates.id, id))
            .returning();

        if (!deletedTemplate.length) {
            throw new Error("Template not found");
        }

        console.log("Template deletion result:", deletedTemplate);
        res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
        console.error("Delete operation failed:", error);
        if (error.message === "Template not found") {
            return res.status(404).json({ error: "Template not found" });
        }
        return res.status(500).json({ error: "Failed to delete template" });
    }
});


module.exports = router