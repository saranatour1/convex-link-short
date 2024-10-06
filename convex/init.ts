import { components } from "./_generated/api";
import { Crons } from "@convex-dev/crons";
import { internalMutation } from "./_generated/server";

const crons = new Crons(components.crons);

// function to remove every anonymous user, with every relation
export const removeAnonymous = internalMutation({
  args:{},
  handler:async(ctx, args_0) =>{
    const allUsers = (await ctx.db.query("users").collect())
    .filter(user => user.isAnonymous === false)
    
    // when I find the users, I get the relation
    



  },
})