import { danger, fail, warn } from 'danger';

const paths = {
  folders: {
    controller: {
      development: 'src/application/controllers'
    },
    useCase: {
      development: 'src/domain/use-cases'
    }
  },
  controllers: [
    {
      moduleName: 'company',
      fileNames: ['create-company']
    }
  ],
  useCases: [
    {
      moduleName: 'company',
      fileNames: ['create-company']
    }
  ]
};

for (const module of paths.controllers) {
  for (const fileName of module.fileNames) {
    const controllerFile = danger.git.fileMatch(
      `${paths.folders.controller.development}/${module.moduleName}/${fileName}.controller.ts`
    );
    const controllerTestFile = danger.git.fileMatch(
      `${paths.folders.controller.development}/${module.moduleName}/__tests__/${fileName}.controller.spec.ts`
    );

    if (
      (controllerFile.edited || controllerFile.created) &&
      (!controllerTestFile.edited || !controllerTestFile.created)
    ) {
      warn(
        `Existem modificações no arquivo ${fileName}.controller.ts, mas não existem modificações no arquivo ${fileName}.controller.spec.ts de teste. Isto é OK desde que o código esteja sendo refatorado.`
      );
    }
  }
}

for (const module of paths.useCases) {
  for (const fileName of module.fileNames) {
    const useCaseFile = danger.git.fileMatch(
      `${paths.folders.useCase.development}/${module.moduleName}/${fileName}.use-case.ts`
    );
    const useCaseTestFile = danger.git.fileMatch(
      `${paths.folders.useCase.development}/${module.moduleName}/__tests__/${fileName}.use-case.spec.ts`
    );

    const codeUseCase = useCaseFile.edited || useCaseFile.created;
    const codeUseCaseTest = !useCaseTestFile.edited || !useCaseTestFile.created;
    if (codeUseCase && codeUseCaseTest) {
      warn(
        `Existem modificações no arquivo ${fileName}.use-case.ts, mas não existem modificações no arquivo ${fileName}.use-case.spec.ts de teste. Isto é OK desde que o código esteja sendo refatorado.`
      );
    }
  }
}

if (danger.github.pr.body.length <= 10) {
  fail('Por favor descreva melhor a sua PR!');
}

if (danger.github.pr.additions + danger.github.pr.deletions > 400) {
  warn(
    ':exclamation: Wow, essa PR parece grande! _Se ela contém mais de uma modificação, tenta separá-las em PRs menores para facilitar o review_'
  );
}
