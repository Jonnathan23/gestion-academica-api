---
trigger: manual
---

Datasource public methods that return Domain Entities or Projections MUST NEVER map the database response inline.

The public method must ONLY fetch the data.

The public method must return the result by invoking a private async mapping method.

The private mapping method MUST invoke a dedicated static Mapper class. If the Mapper class does not exist, YOU MUST CREATE IT.

````typescript
// Public fetching method
public async getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]> {
    const studentContracts = await this.fetchAllStudentContractsWithSellers(studentId);
    return await this.convertArrayToDetailsEntity(studentContracts);
}

// Private isolated mapping method
private async convertArrayToDetailsEntity(contracts: StudentModule[]): Promise<StudentLevelDetailsProjection[]> {
    return contracts.map((contract) => StudentLevelMapper.studentLevelDetailsEntityFromObject(contract));
}

```
````
