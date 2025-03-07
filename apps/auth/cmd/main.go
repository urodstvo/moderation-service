package main

import (
	baseapp "github.com/urodstvo/moderation-service/libs/fx"

	"go.uber.org/fx"
)

func main() {
	fx.New(
		baseapp.CreateBaseApp(
			baseapp.Opts{
				AppName: "Authorization Service",
			},
		),
		// repositories
		// fx.Provide(
		// 	fx.Annotate(
		// 		timersrepositorypgx.NewFx,
		// 		fx.As(new(timersrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		variablespgx.NewFx,
		// 		fx.As(new(variablesrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		keywordsrepositorypgx.NewFx,
		// 		fx.As(new(keywordsrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		channelsrepositorypgx.NewFx,
		// 		fx.As(new(channelsrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		badgesrepositorypgx.NewFx,
		// 		fx.As(new(badgesrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		badgesusersrepositorypgx.NewFx,
		// 		fx.As(new(badgesusersrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		usersrepositorypgx.NewFx,
		// 		fx.As(new(usersrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		userswithchannelrepositorypgx.NewFx,
		// 		fx.As(new(userswithchannelrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		alertsrepositorypgx.NewFx,
		// 		fx.As(new(alertsrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		commandswithgroupsandresponsesrepositorypgx.NewFx,
		// 		fx.As(new(commandswithgroupsandresponsesrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		commandsgroupsrepositorypgx.NewFx,
		// 		fx.As(new(commandsgroupsrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		commandsresponserepositorypgx.NewFx,
		// 		fx.As(new(commandsresponserepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		commandsrepositorypgx.NewFx,
		// 		fx.As(new(commandsrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		rolesrepositorypgx.NewFx,
		// 		fx.As(new(rolesrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		rolesusersrepositorypgx.NewFx,
		// 		fx.As(new(rolesusersrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		greetingsrepositorypgx.NewFx,
		// 		fx.As(new(greetingsrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		chatmessagesrepositorypgx.NewFx,
		// 		fx.As(new(chatmessagesrepository.Repository)),
		// 	),
		// 	fx.Annotate(
		// 		channelscommandsprefixpgx.NewFx,
		// 		fx.As(new(channelscommandsprefixrepository.Repository)),
		// 	),
		// ),
		// services
		// fx.Provide(
		// 	dashboard_widget_events.New,
		// 	variables.New,
		// 	timers.New,
		// 	keywords.New,
		// 	audit_logs.New,
		// 	admin_actions.New,
		// 	badges.New,
		// 	badges_users.New,
		// 	badges_with_users.New,
		// 	users.New,
		// 	twir_users.New,
		// 	alerts.New,
		// 	commands_with_groups_and_responses.New,
		// 	commands_groups.New,
		// 	commands_responses.New,
		// 	commands.New,
		// 	greetings.New,
		// 	roles.New,
		// 	roles_users.New,
		// 	roles_with_roles_users.New,
		// 	twitch.New,
		// 	channels.New,
		// 	chat_messages.New,
		// 	channels_commands_prefix.New,
		// 	tts.New,
		// 	song_requests.New,
		// 	community_redemptions.New,
		// ),
		// app itself
		fx.Provide(),
		fx.Invoke(),
	).Run()
}
