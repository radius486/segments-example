export enum MatchType {
  Contains = 'Contains',
  EqualsTo = 'EqualsTo',
  NotEqualsTo = 'NotEqualsTo',
  Has = 'Has',
  HasNot = 'HasNot',
  GreaterThanOrEqualsTo = 'GreaterThanOrEqualsTo',
  LessThanOrEqualsTo = 'LessThanOrEqualsTo',
  StartsWith = 'StartsWith',
  EndsWith = 'EndsWith',
  Between = 'Between',
  True = 'True',
  False = 'False',
}

export enum ParameterType {
  AchievementStatus = 'AchievementStatus',
  AchievementGroupId = 'AchievementGroupId',
  Number = 'Number',
  Text = 'Text',
  Date = 'Date',
  DateTime = 'DateTime',
  Guid = 'Guid',
  StoreRelationType = 'StoreRelationType',
  StoreId = 'StoreId',
  CustomAttributeId = 'CustomAttributeId',
  CustomAttributeValue = 'CustomAttributeValue',
  Bool = 'Bool',
  MemberStatus = 'MemberStatus',
  MembershipId = 'MembershipId',
  MemberGender = 'MemberGender',
  RewardStatus = 'RewardStatus',
  TagId = 'TagId',
  TagCategoryId = 'TagCategoryId',
}

export enum AttributeCategory {
  Transaction = 'Transaction',
  Member = 'Member',
  Achievement = 'Achievement',
  Reward = 'Reward',
}

export enum UnionType {
  And = 'And',
  Or = 'Or',
  Undefined = 'Undefined',
}

export enum DataSource {
  AttributeBasedCondition = 'AttributeBasedCondition',
  CustomAttributeBasedCondition = 'CustomAttributeBasedCondition',
}
