export function sortingParty(data) {
    data.sort((a,b)=>{
        const nameA = a.party.toUpperCase()
        const nameB = b.party.toUpperCase()
        if (nameA < nameB) {
            return -1; // Sort a to an index lower than b (i.e., a comes first)
          }
        
          if (nameA > nameB) {
            return 1; // Sort a to an index higher than b (i.e., b comes first)
          }
        
          return 0; // Names are equal
        });
        return data;
}